/**
 * Created by vladimir on 05/04/2017.
 */
var html = document.querySelector("html");
if(!html) {
    throw new Error("No html element was found");
}
angular.bootstrap(html, [appModule.name]);
