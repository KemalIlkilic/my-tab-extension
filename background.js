//const tabs = await chrome.tabs.query({})

//const collator = new Intl.Collator()
//tabs.sort((a, b) => collator.compare(a.title, b.title))

function groupTabsByHostname(tabs) {
  return tabs.reduce((groups, tab) => {
    // Use the URL constructor to parse the tab's URL and extract the hostname
    if (tab.url != undefined && tab.url != null) {
      const hostname = new URL(tab.url).hostname

      // Initialize the group array if it doesn't exist
      if (!groups[hostname]) {
        groups[hostname] = []
      }

      // Add the current tab to the group corresponding to its hostname
      groups[hostname].push(tab)
    }

    return groups
  }, {})
}

chrome.action.onClicked.addListener(async () => {
  const tabs = await chrome.tabs.query({})
  const collator = new Intl.Collator()
  tabs.sort((a, b) => collator.compare(a.title, b.title))
  const groupedTabs = groupTabsByHostname(tabs)
  for (const [hostname, tabs] of Object.entries(groupedTabs)) {
    const tabIds = tabs.map(({ id }) => id)
    if (tabIds.length) {
      const group = await chrome.tabs.group({ tabIds })
      let anan = hostname
      /*
      hostname examples.
      github.com
      developer.chrome.com
      web.dev
      developer.mozilla.org
      www.rustyextensions.com
      www.youtube.com
      hackernoon.com
       */
      if (anan.startsWith('chat.')) {
        anan = anan.split('chat.')[1]
      }
      if (anan.startsWith('www.')) {
        anan = anan.split('www.')[1]
      }
      if (anan.endsWith('.tr')) {
        anan = anan.split('.tr')[0]
      }
      if (anan.endsWith('.com')) {
        anan = anan.split('.com')[0]
      }
      if (anan.endsWith('.org')) {
        anan = anan.split('.org')[0]
      }
      if (anan.startsWith('developer.')) {
        anan = anan.replace('developer.', 'dev.')
      }
      await chrome.tabGroups.update(group, { title: anan })
    }
  }
})

// "developer.chrome.com" stringi .split('.')[0] isleminden cıkarsa output ne olur?
