const http = require("http"); // Чтобы использовать HTTP-интерфейсы в Node.js
const readline = require("readline"); // Модуль для консольного ввода
const chalk = require("chalk"); // библиотека цветов

// Ввод в консоли
let intMethod = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

intMethod.question("Введите метод: ", function (answer) {
    let path = answer;

    if (path == "/Ping") {
        const options = {
            hostname: "127.0.0.1",
            port: 3000,
            path: path,
            method: "GET"
        };

        const req = http.request(options, function (res) {
            console.log("Статус сервера: " + chalk.yellow(res.statusCode));
            res.setEncoding("utf8");
        });

        req.on("error", function (e) {
            console.log("Error: " + chalk.red(e.message));
        });

        req.end();
    } else if (path == "/GetInputData") {
        const options = {
            hostname: "127.0.0.1",
            port: 3000,
            path: "/PostInputData",
            method: "GET"
        };

        const req = http.request(options, function (res) {
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
                // chunk - буфер хранения данных в двоичном формате
                console.log("Входные данные: " + chalk.yellow(chunk));
            });

        });

        req.on("error", function (e) {
            console.log("Error: " + chalk.red(e.message));
        });

        req.end();
    } else if (path == "/WriteAnswer") {
        const optionsGetInput = {
            hostname: "127.0.0.1",
            port: 3000,
            path: "/PostInputData",
            method: "GET"
        };

        const reqGetInput = http.request(optionsGetInput, function (res) {
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
                // chunk - буфер хранения данных в двоичном формате
                console.log("Входные данные: " + chalk.yellow(chunk));

                let Int = JSON.parse(chunk);
                // попробовать создать класс и на основе класса делать ответ и отправлять черз POST
                function Sums() {
                    let sum = 0;
                    for (let i = 0; i < Int.Sums.length; i++) {
                        sum += Int.Sums[i];
                    }
                    let sumFix = sum * Int.K;

                    return sumFix.toFixed(2);
                }

                function MulResult() {
                    let mul = 1;
                    for (let i = 0; i < Int.Muls.length; i++) {
                        mul *= Int.Muls[i];
                    }

                    return mul;
                }

                function SortedInputs() {
                    let arr = Int.Sums.concat(Int.Muls);

                    return arr.sort();
                }

                const Output = {
                    SumResult: +Sums(),
                    MulResult: +MulResult(),
                    SortedInputs: SortedInputs()
                };

                const data = JSON.stringify(Output);
                console.log('Отправленный ответ: ', chalk.yellow(data));

                const optionsGetAnswer = {
                    hostname: "127.0.0.1",
                    port: 3000,
                    path: '/GetAnswer',
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": data.length
                    }
                };

                const reqGetAnswer = http.request(optionsGetAnswer, res => {
                    res.on("data", d => {
                        process.stdout.write(d);
                    });
                });

                reqGetAnswer.on("error", function (e) {
                    console.log("Error: " + chalk.red(e.message));
                });

                reqGetAnswer.write(data); // вывод отпровляемых
                reqGetAnswer.end();
            });
        });

        reqGetInput.end();
    } else if (path == "/Stop") {
        const options = {
            hostname: "127.0.0.1",
            port: 3000,
            path: path
        };

        const req = http.request(options, function (res) {
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
                console.log("Ответ: " + chunk);
            });
        });

        req.on("error", function (e) {
            console.log("Error: " + chalk.red(e.message));
        });

        req.end();
    } else {
        console.log(chalk.red("Такого метода нет!"));
    }

    intMethod.close();
});