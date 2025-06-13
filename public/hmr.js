try {
  const source = new EventSource("/_events");

  source.onopen = (_e) => {
    console.log(`HMR Script Connected.`);
  };

  source.onmessage = reload;
  source.onerror = reload;
} catch (error) {
  console.error("Cannot start HMR");
}

function reload() {
  if (!navigator.onLine) return
  location.reload();
}
