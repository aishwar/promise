Deferred and Promises
=====================

Here is my understanding of "Deferred" vs "Promise" objects.

A promise object is "a promise to return something in the future". The object allows you to check if the promise has been honoured or not. You cannot mark the promise as honoured or failed. Hence a promise object provides you hooks to respond:

 - on success (promise honoured)
 - on failure (promise failed)
 - on completion (promise has either been honoured or has failed)


A deferred object can be thought of as a promise manager. It stores a promise within it, along with the ability to change the state of the promise. A deferred object, would hence have methods that run:

 - on success (promise has been honoured)
 - on failure (primise has failed)
 - on completion (promise has been honoured or has failed)


It would also have methods to mark

 - the deferred object as resolved (mark the promise as honoured)
 - the deferred object as rejected (mark the promise as failed)


As you can see, a deferred object is the same as a promise object - with the ability to alter the state of the promise. A promise object can only respond to state changes, but cannot change its own state. A deferred object is a promise object with the ability to mark state changes.

Hence, when you return a promise object, you would have created a deferred object to manage the promise's state and return the promise for consumption. When the promise has been fulfilled or failed, you mark the deferred object as resolved or rejected. The consumers of the promise will be notifed and any success/failure/completion callbacks will run as required.

A note about Promise state changes:
-----------------------------------

A promise/deferred object can be in one of three states - unfulfilled, honoured and failed

The initial state is "unfulfilled". And it can change to "honoured" or "failed". Once it has been marked "honoured" or "failed", it can no longer change state to anything else.
