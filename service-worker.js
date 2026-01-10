self.addEventListener('install', function (event) {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('Service Worker: Activated');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
    console.log('Service Worker: Push Received');

    let title = 'HostMan Notification';
    let options = {
        body: 'Anda memiliki notifikasi baru!',
        icon: 'img/icon.png',
        badge: 'img/icon.png'
    };

    if (event.data) {
        try {
            const data = event.data.json();
            title = data.title || title;
            options.body = data.body || options.body;
            options.icon = data.icon || options.icon;
            options.data = data.url || '/'; // Store URL in data
        } catch (e) {
            console.error('Error parsing push data:', e);
            options.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    console.log('Service Worker: Notification Clicked');
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return clients.openWindow(event.notification.data || '/');
        })
    );
});
