
export default function serviceworker(){

    // Use window.location.origin to get the base URL
    let swUrl = `${window.location.origin}/SW.js`; 
 
    navigator.serviceWorker.register(swUrl)
        .then((response) => {
            console.log("Service Worker registration successful:", response);
        })
        .catch((error) => {
            console.log("Service Worker registration failed:", error);
        });
 
 /*     if('serviceWorker' in navigator){
 
         window.addEventListener('load',function(){
             navigator.serviceWorker.register(swUrl)
             .then(function(registration){
                 console.log("worker registration is successfull",registration.scope);
             },function(err){
                 console.log("Failed")
             })
             .catch(function(err){
                 console.log(err)
             })
         })
 
     }else{
         console.log("Service worker is not supported")
     } */
 
 }

 