const interval = setInterval(() => {
    fetch('/web-push/api/hi').then(response => response.text()).then(r => console.log(r))
}, 1000)

