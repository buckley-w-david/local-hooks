const parentForm = document.querySelector("#parent");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const hooks = document.querySelector("#hooks");
const newButton = document.querySelector("#new")

// TODO: Delete a hook
let hookIndex = 0

function storeSettings() {
  browser.storage.local.set({
    auth: {
      username: usernameInput.value,
      password: passwordInput.value
    },
    hooks: Array.from(hooks.querySelectorAll("div.hook")).map(hook => {
        return {
            selector: hook.querySelector('.selector').value || "",
            listeners: hook.querySelector('.listener').value?.split("\n") || [],
            event_type: hook.querySelector('.event').value || "",
        }
    })
  });
}

function deleteHook(index) {
    const hook = document.getElementById(`hook-${index}`)
    hooks.removeChild(hook)
}

function createHook(hook) {
    const i = ++hookIndex
    let hookNode = document.createElement("div");
    hookNode.classList.add("hook")
    hookNode.id = `hook-${i}`

    let selectorLabel = document.createElement("label");
    selectorLabel.id = `hook${i}-selector-label`
    selectorLabel.for = `hook${i}-selector`
    selectorLabel.textContent = "Selector"

    let listenersLabel = document.createElement("label");
    listenersLabel.id = `hook${i}-listener-label`
    listenersLabel.name = `hook${i}-listener-label`
    listenersLabel.for = `hook${i}-listener`
    listenersLabel.textContent = "Listeners"

    let eventLabel = document.createElement("label");
    eventLabel.id = `hook${i}-event-label`
    eventLabel.name = `hook${i}-event-label`
    eventLabel.for = `hook${i}-event`
    eventLabel.textContent = "Trigger Event"

    let listeners = document.createElement("textarea");
    listeners.id = `hook${i}-listeners`
    listeners.name = `hook${i}-listeners`
    listeners.placeholder = "https://example.com/callback"
    listeners.classList.add("input")
    listeners.classList.add("listener")
    listeners.rows = "5"
    listeners.cols = "60"
    listeners.addEventListener("blur", storeSettings);

    let selector = document.createElement("input")
    selector.id = `hook${i}-selector`
    selector.name = `hook${i}-selector`
    selector.type = "text"
    selector.classList.add("input")
    selector.classList.add("selector")
    selector.placeholder = "a.class"
    selector.addEventListener("blur", storeSettings);

    let eventInput = document.createElement("input")
    eventInput.id = `hook${i}-event`
    eventInput.name = `hook${i}-event`
    eventInput.type = "text"
    eventInput.classList.add("input")
    eventInput.classList.add("event")
    eventInput.placeholder = "click"
    eventInput.addEventListener("blur", storeSettings);

    let garbageIcon = document.createElement("img")
    garbageIcon.src = "garbage.svg"
    garbageIcon.height = "20"
    garbageIcon.width = "16.29"
    garbageIcon.classList.add("trash")
    garbageIcon.addEventListener("click", () => {
        deleteHook(i)
        storeSettings()
    });

    if (hook) {
        listeners.value = hook.listeners.join("\n")
        selector.value = hook.selector
        eventInput.value = hook.event_type
    }

    hookNode.append(
        listenersLabel,
        listeners,
        selectorLabel,
        selector,
        eventLabel,
        eventInput,
        garbageIcon,
    )

    return hookNode
}

function addHook(hook) {
    let hookNode = createHook(hook)
    hooks.append(hookNode)
}


/*
Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {
    usernameInput.value = restoredSettings?.auth?.username || "";
    passwordInput.value = restoredSettings?.auth?.password || "";
    restoredSettings.hooks.forEach(addHook)
}

function onError(e) {
    console.error(e);
}

/*
On opening the options page, fetch stored settings and update the UI with them.
*/
browser.storage.local
    .get()
    .then(updateUI, onError);

/*
On blur, save the currently selected settings.
*/
usernameInput.addEventListener("blur", storeSettings);
passwordInput.addEventListener("blur", storeSettings);
hooks.addEventListener("blur", storeSettings);
newButton.addEventListener("click", () => addHook());
