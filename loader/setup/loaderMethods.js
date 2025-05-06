async function createGlobalLoaderMethods() {
    if (global.loadBulk) {
        return;
    }
    global.loadBulk = function (dependencies, callback, error) {
        return new Promise((resolve, reject) => {
            const success = () => {
                if (callback instanceof Function) {
                    callback();
                }
                resolve();
            };
            const fail = () => {
                if (error instanceof Function) {
                    error();
                }
                reject(new Error("Failed to load dependencies", dependencies));
            };
            loader.loadBulk(dependencies, success, fail);
        });
    };
}

module.exports = createGlobalLoaderMethods;
