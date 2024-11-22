const source = new EventSource('/_events')

function reload() {
    location.reload();
}

source.onopen = (_e) => {
    console.log(`HMR Script Connected.`)
}

source.onmessage = reload
source.onerror = reload