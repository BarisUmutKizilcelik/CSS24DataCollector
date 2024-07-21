import "./styles.css"; // Importing the CSS file
import edgeML from "edge-ml"; // Importing the edge-ml library
import MobileDetect from "mobile-detect"; // Importing the MobileDetect library

const checkbox = document.getElementById("check"); // Getting the checkbox element by its ID
const context = document.getElementById("context"); // Getting the text input element by its ID
const xText = document.getElementById("xout"); // Getting the status span element by its ID
var apiKeyInput = "d26b18f97a3ec400403a285ab8fa651b"; // Setting a variable with the API key
let motionEventListenerAdded = false; // Boolean to track if the motion event listener has been added
var isRecording = false; // Boolean to track the recording status
let collector; // Variable to hold the dataset collector instance
var defaultTags = {}; // Object to hold default tags for the data
const mobile = new MobileDetect(window.navigator.userAgent); // Creating a new MobileDetect instance to detect mobile device info
xText.innerHTML = "Not Recording"; // Setting the initial text for the status element

if (mobile.mobile()) {
  defaultTags.mobile = mobile.mobile(); // Adding the mobile device type to default tags if detected
}

if (mobile.userAgent()) {
  defaultTags.browser = mobile.userAgent(); // Adding the user agent string to default tags if available
}

const enableMotionEvents = async () => {
  if (checkbox.checked && !motionEventListenerAdded) {
    // If checkbox is checked and event listener is not added
    xText.innerHTML = "Recording"; // Update status text to "Recording"
    xText.className = "status-recording"; // Update status class to indicate recording
    console.log("enableToggle"); // Log to console that motion events are being enabled
    collector = await edgeML.datasetCollector(
      // Initialize dataset collector with edge-ml
      "https://beta.edge-ml.org", // URL of the edge-ml server
      apiKeyInput, // API key for authentication
      context.value, // Participant ID from the input field
      true, // True to provide own timestamps
      [
        "accX",
        "accY",
        "accZ", // Sensor names for accelerometer data
        "accelerationIncludingGravityX",
        "accelerationIncludingGravityY",
        "accelerationIncludingGravityZ", // Sensor names for accelerometer data including gravity
        "rotationRateAlpha",
        "rotationRateBeta",
        "rotationRateGamma", // Sensor names for gyroscope data
      ],
      Object.assign(
        {
          participantId: document.getElementById("context").value, // Adding participant ID to Metadata
          activity: document.getElementById("label").value, // Adding activity type to Metadata
        },
        defaultTags, // Adding defaulTags to Metadata
      ),
      "activity_" + document.getElementById("label").value, // Naming the activity dataset
    );
    window.addEventListener("devicemotion", handleMotionEvent); // Adding event listener for device motion
    motionEventListenerAdded = true; // Updating the flag to indicate listener is added
  } else if (!checkbox.checked && motionEventListenerAdded) {
    // If checkbox is unchecked and event listener is added
    console.log("disableToggle"); // Log to console that motion events are being disabled
    xText.innerHTML = "Not Recording"; // Update status text to "Not Recording"
    xText.className = "status-not-recording"; // Update status class to indicate not recording
    await collector.onComplete(); // Complete the data collection
    window.removeEventListener("devicemotion", handleMotionEvent); // Remove the device motion event listener
    motionEventListenerAdded = false; // Updating the flag to indicate listener is removed
  }
};

async function handleMotionEvent(event) {
  let c1 = collector; // Reference to the collector instance
  // Access and process motion data from the event object
  console.log("handleMotion"); // Log to console that motion is being handled
  const acceleration = event.acceleration; // Get the acceleration data from the event
  const accelerationIncludingGravity = event.accelerationIncludingGravity; // Get the acceleration including gravity data from the event
  const rotationRate = event.rotationRate; // Get the rotation rate data from the event
  console.log("Acceleration:", acceleration); // Log the acceleration data to the console

  c1.addDataPoint(
    "accX", // Name of the sensor
    acceleration.x, // Value
  );
  c1.addDataPoint(
    "accY", // Name of the sensor
    acceleration.y, // Value
  );
  c1.addDataPoint(
    "accZ", // Name of the sensor
    acceleration.z, // Value
  );
  c1.addDataPoint(
    "accelerationIncludingGravityX", // Name of the sensor
    accelerationIncludingGravity.x, // Value
  );
  c1.addDataPoint(
    "accelerationIncludingGravityY", // Name of the sensor
    accelerationIncludingGravity.y, // Value
  );
  c1.addDataPoint(
    "accelerationIncludingGravityZ", // Name of the sensor
    accelerationIncludingGravity.z, // Value
  );
  c1.addDataPoint(
    "rotationRateAlpha", // Name of the sensor
    rotationRate.alpha, // Value
  );
  c1.addDataPoint(
    "rotationRateBeta", // Name of the sensor
    rotationRate.beta, // Value
  );
  c1.addDataPoint(
    "rotationRateGamma", // Name of the sensor
    rotationRate.gamma, // Value
  );
  console.log("gggg"); // Log to console for debugging purposes
}

// Add event listener for checkbox change
checkbox.addEventListener("change", enableMotionEvents);

// Call enableMotionEvents initially to set the state based on checkbox status
enableMotionEvents();
console.log("hello"); // Log to console to indicate the script has initialized
