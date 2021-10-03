console.log("local-hooks loaded!")

browser.storage.local.get().then(settings => {
    const listen = (selector, listeners, event_type) => {
        // Add an event listener to each element matching the selector
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener(event_type, async (e) => {
                // The event listener makes a POST request to the registered "listeners" which is a list of urls
                const username = settings?.auth?.username || ""
                const password = settings?.auth?.password || ""
                headers = {
                    "Content-Type": 'application/json'
                }

                if (username) {
                    const digest = btoa(`${username}:${password}`)
                    headers["Authorization"] = `Basic ${digest}`
                }

                const options = {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        url: document.URL,
                        content: element.outerHTML,
                        // TODO: should put some info about the event in here
                    })
                }

                await Promise.all(listeners.map(async (url) => {
                    await fetch(url, options)
                        .then(response => response.json() )
                        .then(console.log)
                        .catch(console.error)
                }))
            })
        })
    }

    settings.hooks.forEach(hook => {
        listen(hook.selector, hook.listeners, hook.event_type)
    })
})
