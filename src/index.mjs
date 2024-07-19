import "./styles.css";
import edgeML from "edge-ml";
import MobileDetect from "mobile-detect";

const checkbox = document.getElementById("check");
const context = document.getElementById("context");
const xText = document.getElementById("xout");
var apiKeyInput = "d26b18f97a3ec400403a285ab8fa651b";
let motionEventListenerAdded = false;
var isRecording = false;
let collector;
var defaultTags = {};
const mobile = new MobileDetect(window.navigator.userAgent);
xText.innerHTML = "Not Recording";

if (mobile.mobile()) {
  defaultTags.mobile = mobile.mobile();
}

if (mobile.userAgent()) {
  defaultTags.browser = mobile.userAgent();
}
const enableMotionEvents = async () => {
  if (checkbox.checked && !motionEventListenerAdded) {
    xText.innerHTML = "Recording";
    xText.className = "status-recording";
    console.log("enableToggle");
    collector = await edgeML.datasetCollector(
      "https://beta.edge-ml.org",
      apiKeyInput,
      context.value,
      true,
      [
        "accX",
        "accY",
        "accZ",
        "accelerationIncludingGravityX",
        "accelerationIncludingGravityY",
        "accelerationIncludingGravityZ",
        "rotationRateAlpha",
        "rotationRateBeta",
        "rotationRateGamma",
      ],
      //{ accX: acceleration.x, accY: acceleration.y, accZ: acceleration.z },
      Object.assign(
        {
          participantId: document.getElementById("context").value,
          activity: document.getElementById("label").value,
        },
        defaultTags
      ),
      "activity_" + document.getElementById("label").value
    );
    window.addEventListener("devicemotion", handleMotionEvent);
    motionEventListenerAdded = true;
  } else if (!checkbox.checked && motionEventListenerAdded) {
    console.log("disableToggle");
    xText.innerHTML = "Not Recording";
    xText.className = "status-not-recording";
    await collector.onComplete();
    window.removeEventListener("devicemotion", handleMotionEvent);
    motionEventListenerAdded = false;
  }
};

async function handleMotionEvent(event) {
  let c1 = collector;
  // Access and process motion data from the event object
  console.log("handleMotion");
  const acceleration = event.acceleration;
  const accelerationIncludingGravity = event.accelerationIncludingGravity;
  const rotationRate = event.rotationRate;
  console.log("Acceleration:", acceleration);

  c1.addDataPoint(
    "accX", // Name of the sensor
    acceleration.x // Value
  );
  c1.addDataPoint(
    "accY", // Name of the sensor
    acceleration.y // Value
  );
  c1.addDataPoint(
    "accZ", // Name of the sensor
    acceleration.z // Value
  );
  c1.addDataPoint(
    "accelerationIncludingGravityX", // Name of the sensor
    accelerationIncludingGravity.x // Value
  );
  c1.addDataPoint(
    "accelerationIncludingGravityY", // Name of the sensor
    accelerationIncludingGravity.y // Value
  );
  c1.addDataPoint(
    "accelerationIncludingGravityZ", // Name of the sensor
    accelerationIncludingGravity.z // Value
  );
  c1.addDataPoint(
    "rotationRateAlpha", // Name of the sensor
    rotationRate.alpha // Value
  );
  c1.addDataPoint(
    "rotationRateBeta", // Name of the sensor
    rotationRate.beta // Value
  );
  c1.addDataPoint(
    "rotationRateGamma", // Name of the sensor
    rotationRate.gamma // Value
  );
  console.log("gggg");
}

// You can update the UI or perform other actions based on motion data

// Add event listener for checkbox change
checkbox.addEventListener("change", enableMotionEvents);

// Call enableMotionEvents initially to set the state based on checkbox status
enableMotionEvents();
console.log("hello");
