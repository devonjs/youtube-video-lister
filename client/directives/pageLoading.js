(function() {
    "use strict";

    const announceLoadFinished = (rootElement) => {
        const loadFinishedText = "Load complete"
        const header = rootElement.querySelector("h1")
        const rootDimensions = rootElement.getBoundingClientRect()
        const rootHeight = rootDimensions.height
        let currentPos = 0

        header.innerText = loadFinishedText

        const animationComplete = () => {
            return (
                (rootElement.getBoundingClientRect().top >= rootHeight))
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const intervalID = setInterval(() => {
                    rootElement.style.top = `${currentPos += 10}px`
                    if (animationComplete()) {
                        resolve(true)
                    }
                }, 1)
            }, 1250)
        })
    }

    angular.module("jukinApp").directive("pageLoading", function() {
        return {
            restrict: "E",
            scope: true,
            template: `
            <div class="body-overlay" ng-if="shouldCloak">
                <div>
                    <h1 id="cloak-announcer">Please wait, while the page loads..</h1>
                    <img class="loading-img" class="loadingCirclesPlaylist" src="assets/loading.gif"/>
                </div>
            </div>
            `,
            link: function(scope, elem, attrs) {
                scope.shouldCloak = true
                // make sure to explicitly check the boolean;
                // the value will be undefined before the page
                // tries to load the playlists!

                window.addEventListener("load", function() {
                    // weird behavior; oldValue & newValue can both be true
                    let lastValue = undefined
                    scope.$watch("home.playlistLoading", function (oldValue, newValue) {
                        if (lastValue !== undefined && oldValue !== lastValue)
                            newValue = oldValue
                        lastValue = oldValue
                        if (newValue === false) {
                            announceLoadFinished(elem.context.firstElementChild).then( () => {
                                scope.shouldCloak = false
                            })
                        }
                    })
                })
            }
        }
    });
})();