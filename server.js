// подключение модуля
const http = require("http"); // Чтобы использовать HTTP-интерфейсы в Node.js
const chalk = require("chalk"); // библиотека цветов

let Input = {
    K: 10,
    Sums: [1.01, 2.02],
    Muls: [1, 4]
};

let Output = JSON.stringify({
    SumResult: 30.3,
    MulResult: 4,
    SortedInputs: [1, 1.01, 2.02, 4]
});

// создание сервера
const server = http.createServer((req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url === "/Ping") {
                res.end(req.statusCode);
            } else if (req.url === "/PostInputData") {
                res.writeHead(200, {
                    "Content-Type": "text/javascript"
                });

                res.end(JSON.stringify(Input));
                // console.log(chalk.green(req.url));
            } else if (req.url === "/Stop") {
                setTimeout(function () {
                    server.close(() => {
                        console.log(chalk.red("Server close"));
                    });
                }, 1000);

                res.end(chalk.red("Server close"));
            }
            break;

        case "POST":
            if (req.url === "/GetAnswer") {
                let body = "";
                req.on("data", function (data) {
                    // принимаем данные и присваем переменной
                    body += data;
                });
                req.on("end", function () {
                    //окончание запроса вывод данных отправленных клиентом
                    let POST = body;
                    console.log("Полученый ответ: " + chalk.green(POST));

                    // Такой подход оправдан, поскольку в итоге сравниваются строки, представляющие собой указатель на тип - значение.
                    // Но он не всегда срабатывает, главным образом потому, что тот или иной порядок свойств объекта не гарантируется.
                    if (POST === Output) {
                        console.log(chalk.green('Ответ верный.'));
                    } else {
                        console.log(chalk.red('Ответ не верный.'));
                    }
                });

                res.end();
            }
            break;

        default:
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.end('404 Не найдено');
    }
});
server.listen(3000, () => console.log("Сервер работает")); // http://127.0.0.1:3000/