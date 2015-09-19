var Firebase = require('firebase'),
    env = require('./scripts/env.js'),
    firebaseRoot = env.firebaseRoot,
    Commonmark = require('commonmark'),
    reader = Commonmark.Parser(),
    writer = Commonmark.HtmlRenderer(),
    firebaseSecret = process.env.FIREBASE_SECRET;


console.log('firebaseSecret', firebaseSecret);

var ref = new Firebase(firebaseRoot);
ref.authWithCustomToken(firebaseSecret, function(error, authData) {
    if (error) {
        console.log('error', error);
    } else {
        console.log('authData', authData);
    }

    var aclRef = ref.child('acl');
    aclRef.on('child_added', function(snap) {
        console.log('child_added');
        var entry = snap.val(),
            entryKey = snap.key(),
            entryRef = snap.ref();

        if (!entry.userCreated) {
            var usersRef = new Firebase(firebaseRoot + 'users'),
                now = (new Date()).toString();

            usersRef.orderByChild('email').equalTo(entry.email).once('value', function(snap) {
                var matches = snap.numChildren();
                if (matches === 0) {
                    var userRef = usersRef.push();

                    entryRef.child('userKey').set(userRef.key(), function(error) {
                        if (error) {
                            console.warn('userKey set error', error);
                        } else {
                            var user = {
                                email: entry.email
                            };

                            user[entry.provider] = entryKey;
                            user.created = now;
                            user.isAdmin = false;

                            userRef.set(user, function(error) {
                                if (error) {
                                    console.warn('user set error', error);
                                } else {
                                    entryRef.child('userCreated').set(now);
                                }
                            });
                        }
                    });
                } else if (matches === 1) {
                    entryRef.child('userCreated').set(now);
                    snap.forEach(function(childSnap) {
                        entryRef.child('userKey').set(childSnap.key());
                    });

                }
            });
        }
    });

    var slidesRef = ref.child('slides');
    slidesRef.on('child_changed', function(snap) {
        var slide = snap.val();

        if (slide.commonmark) {
            var parsed = reader.parse(slide.commonmark),
                result = writer.render(parsed);
            snap.ref().child('content').set(result);
        }
    });
});