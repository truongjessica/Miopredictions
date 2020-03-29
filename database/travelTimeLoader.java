import java.io.FileInputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;
import java.util.concurrent.ExecutionException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;

//java firestore api client
public class travelTimeLoader {
    private Firestore db;

    public static double morn = 0, mornCount = 0, mornAvg = 0;
    public static double midMorn = 0, midMornCount = 0, midMornAvg = 0;
    public static double afternoon = 0, afterCount = 0, afterAvg = 0;
    public static double dinner = 0, dinCount = 0, dinAvg = 0;
    public static double night = 0, nightCount = 0, nightAvg = 0;
    public static double late = 0, lateCount = 0, lateAvg = 0;

    public travelTimeLoader() throws IOException {
        String projectId = "dataanalysis-e8abe";
        FileInputStream serviceAcct = new FileInputStream("/Users/lydiama/WinHacks/credentials.json");

        GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAcct);
        FirebaseOptions options = new FirebaseOptions.Builder().setCredentials(credentials).setProjectId(projectId)
                .build();
        FirebaseApp.initializeApp(options);

        Firestore db = FirestoreClient.getFirestore();

        this.db = db;
    }

    Firestore getDb() {
        return db;
    }

    public void loadFireStore() {
        try {
            URL data = new URL("https://realcheesyapiname.herokuapp.com/api/det_test4");

            HttpURLConnection conn = (HttpURLConnection) data.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();
            int responsecode = conn.getResponseCode();

            if (responsecode != 200) {
                throw new RuntimeException("HttpResponseCode:" + responsecode);
            } else {
                System.out.println("Processing JSON timing files");
                Scanner sc = new Scanner(data.openStream());

                String fullLine = "";

                if (sc.hasNext()) { // whole thing is one line
                    fullLine = sc.nextLine();
                }
                sc.close();

                JSONParser parse = new JSONParser();
                JSONObject rawFullData = (JSONObject) parse.parse(fullLine); // parse file to json
                JSONArray fullData = (JSONArray) rawFullData.get("info"); // create JSONarray of route objects

                // outer:
                for (int i = 0; i < fullData.size(); i++) { // assume start dest all the same
                    JSONObject entry = (JSONObject) fullData.get(i);
                    String start = (String) entry.get("Source_Name");
                    String end = (String) entry.get("Destination_name");
                    // inner:
                    for (int j = i + 1; j < fullData.size(); j++) {
                        JSONObject entry2 = (JSONObject) fullData.get(j);
                        String currEnd = (String) entry2.get("Destination_name"); // for each entry w same end.......
                        if (j == fullData.size() - 1) { // end of dataset, calculate and end method
                            System.out.println("Last");
                            calculateAverage();
                            uploadToDB(start, end);
                            return;
                        } else if (end.equals(currEnd)) { // entry has same path, update sums and counts
                            updateTimeIntervals(entry2);
                        } else { // entry has a different path. calculate for previous path.
                            System.out.println(" OLD ROUTE " + end + " NEW ROUTE " + currEnd);
                            calculateAverage(); // previous path's average for each time of day
                            uploadToDB(start, end); // upload to firestore
                            i = j; // begin outer loopat new path
                            break;
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException p) {
            p.printStackTrace();
        } catch (InterruptedException i) {
            i.printStackTrace();
        } catch (ExecutionException ee) {
            ee.printStackTrace();
        }
    }

    public static void updateTimeIntervals(JSONObject entry) {
        String start = (String) entry.get("Start_time");
        String ttStr = (String) entry.get("seconds");

        if (start.compareTo("00:00:00") >= 1 && start.compareTo("06:00:00") <= -1) { // 12am to 6am late
            late += Double.parseDouble(ttStr);
            lateCount++;
        } else if (start.compareTo("06:00:00") >= 1 && start.compareTo("09:00:00") <= -1) { // 6am to 9am morning
            morn += Double.parseDouble(ttStr);
            mornCount++;
        } else if (start.compareTo("09:00:00") >= 1 && start.compareTo("12:00:00") <= -1) { // 9am to 12pm midMorning
            midMorn += Double.parseDouble(ttStr);
            midMornCount++;
        } else if (start.compareTo("12:00:00") >= 1 && start.compareTo("17:00:00") <= -1) { // 12pm to 5pm afternoon
            afternoon += Double.parseDouble(ttStr);
            afterCount++;
        } else if (start.compareTo("17:00:00") <= 1 && start.compareTo("21:00:00") <= -1) { // 5pm to 9pm dinner
            dinner += Double.parseDouble(ttStr);
            dinCount++;
        } else { // 9pm to 12am night
            night += Double.parseDouble(ttStr);
            nightCount++;
        }
    }

    public static void calculateAverage() {
        // 12am to 6am
        lateAvg = late / lateCount;
        late = 0;
        lateCount = 0;
        // 6am to 9am
        mornAvg = morn / mornCount;
        morn = 0;
        mornCount = 0;
        System.out.println(" average for morn is " + mornAvg);
        // 9am to 12pm
        midMornAvg = midMorn / midMornCount;
        midMorn = 0;
        midMornCount = 0;
        // 12pm to 5pm
        afterAvg = afternoon / afterCount;
        afternoon = 0;
        afterCount = 0;
        // 5pm to 9pm
        dinAvg = dinner / dinCount;
        dinner = 0;
        dinCount = 0;
        // 9pm to 12am
        nightAvg = night / nightCount;
        night = 0;
        nightCount = 0;
    }

    public void uploadToDB(String source, String destination) throws InterruptedException, ExecutionException {
        System.out.println("Uploading to db");
        Map<String, Object> lateData = new HashMap<>();
        lateData.put("Source_Name", source);
        lateData.put("Destination_name", destination);
        lateData.put("Time_of_day", "late");
        lateData.put("Travel_time", lateAvg);
        db.collection("Detroit").add(lateData);
        System.out.println(Arrays.asList(lateData));

        Map<String, Object> mornData = new HashMap<>();
        mornData.put("Source_Name", source);
        mornData.put("Destination_name", destination);
        mornData.put("Time_of_day", "morning");
        mornData.put("Travel_time", mornAvg);
        db.collection("Detroit").add(mornData);
        System.out.println(Arrays.asList(mornData));

        Map<String, Object> midMornData = new HashMap<>();
        midMornData.put("Source_Name", source);
        midMornData.put("Destination_name", destination);
        midMornData.put("Time_of_day", "midMorning");
        midMornData.put("Travel_time", midMornAvg);
        db.collection("Detroit").add(midMornData);
        System.out.println(Arrays.asList(midMornData));
    
        Map<String, Object> afterData = new HashMap<>();
        afterData.put("Source_Name", source);
        afterData.put("Destination_name", destination);
        afterData.put("Time_of_day", "afternoon");
        afterData.put("Travel_time", afterAvg);
        db.collection("Detroit").add(afterData);
        System.out.println(Arrays.asList(afterData));

        Map<String, Object> dinData = new HashMap<>();
        dinData.put("Source_Name", source);
        dinData.put("Destination_name", destination);
        dinData.put("Time_of_day", "dinner");
        dinData.put("Travel_time", dinAvg);
        db.collection("Detroit").add(dinData);
        System.out.println(Arrays.asList(dinData));

        Map<String, Object> nightData = new HashMap<>();
        nightData.put("Source_Name", source);
        nightData.put("Destination_name", destination);
        nightData.put("Time_of_day", "night");
        nightData.put("Travel_time", nightAvg);
        ApiFuture<DocumentReference> addedDocRef2 = db.collection("Detroit").add(nightData);
        System.out.println("Added document with ID: " + addedDocRef2.get().getId());
        System.out.println(Arrays.asList(nightData));
    }

    public void retrieveAllDocuments() throws Exception {
        Map<String, Object> data = new HashMap<>();
        data.put("name", "Tokyo");
        data.put("country", "Japan");
        ApiFuture<DocumentReference> addedDocRef2 = db.collection("").add(data);
        System.out.println("Added document with ID: " + addedDocRef2.get().getId());
      }

    public static void main(String[] args) throws Exception {
        System.out.println("Hi");
        travelTimeLoader test = new travelTimeLoader();
        //test.retrieveAllDocuments();
        test.loadFireStore();
    }

}
