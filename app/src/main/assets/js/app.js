// ===========================
// SOS App — Navigation & Logic
// ===========================

/**
 * Navigate to a screen by id
 * @param {string} id - screen id without the 'screen-' prefix
 */
function go(id) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById('screen-' + id);
  if (target) {
    target.classList.add('active');
    // Scroll to top of new screen
    const content = target.querySelector('.page-content');
    if (content) content.scrollTop = 0;
  }
}

/**
 * SOS button alert — in a real app this would send GPS + alert
 */
function sosAlert() {
    // 📞 Call emergency number
    window.location.href = "tel:112";

    setTimeout(() => {
            if (window.Android) {
                Android.sendSOSMesh("HELP NEEDED!");
            }
        }, 3000);
}

/**
 * Simulate a phone call
 * @param {string} number - phone number to call
 */
function callNumber(number) {
  // On a real device this would use: window.location.href = 'tel:' + number;
  const link = document.createElement('a');
  link.href = 'tel:' + number;
  link.click();
}

/**
 * Open Google Maps directions to a hospital
 * @param {string} name - hospital name
 */
function getDirections(name) {
  const query = encodeURIComponent(name);
  window.open('https://www.google.com/maps/search/?api=1&query=' + query, '_blank');
}

// ===========================
// Keyboard Navigation
// ===========================

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id !== 'screen-home') {
      go('home');
    }
  }
});

function callNumber(number) {
    // Check if device supports calling
    if (!number) {
        alert("Invalid number");
        return;
    }

    // This will open phone dialer
    window.location.href = "tel:" + number;
}

function sosAlert() {
    let confirmSOS = confirm("Trigger Emergency SOS?");
        if (!confirmSOS) return;

        let contacts = document.querySelectorAll(".emergency-number");

        if (contacts.length === 0) {
            alert("No emergency contacts found!");
            return;
        }


        callNextContact(contacts, 0);

    // 📡 After delay → send mesh + location
    setTimeout(() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {

                let msg = "HELP! Location: "
                        + pos.coords.latitude + ","
                        + pos.coords.longitude;

                alert("📡 Sending SOS with location...");

                if (window.Android) {
                    Android.sendSOSMesh(msg);
                }

            }, () => {
                alert("Location access denied");

                // fallback
                if (window.Android) {
                    Android.sendSOSMesh("HELP NEEDED!");
                }
            });
        }

    }, 3000);
}

function callNextContact(contacts, index) {

    // If all contacts tried → fallback
    if (index >= contacts.length) {

        window.location.href = "tel:112";

        // mesh fallback
        setTimeout(() => {
            if (window.Android) {
                Android.sendSOSMesh("HELP NEEDED!");
            }
        }, 3000);

        return;
    }

    let number = contacts[index].innerText;


    // Call current contact
    window.location.href = "tel:" + number;

    // Wait 10 sec → try next
    setTimeout(() => {
        callNextContact(contacts, index + 1);
    }, 10000);
}

function callEmergencyContact() {
    let number = document.getElementById("emergency-number").innerText;

    window.location.href = "tel:" + number;
}

function isOnline() {
    return navigator.onLine;
}


