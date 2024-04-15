const http = require('http');

// URL da API trocar o cep apos us/ para alterar o local (cep americano)
const apiUrl = 'http://api.zippopotam.us/us/33162';

// Configurações do servidor HTTP
const server = http.createServer((req, res) => {
    // Fazendo uma solicitação HTTP para a API
    http.get(apiUrl, (apiRes) => {
        let data = '';

        // Recebendo os dados da resposta da API
        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        // Quando todos os dados forem recebidos
        apiRes.on('end', () => {
            try {
                const locationInfo = JSON.parse(data);
                
                //Pega as informaçoes na api de maneira especifica
                const cidade = locationInfo.places[0]['place name'];
                const estado = locationInfo.places[0].state;
                const abreviacaoEstado = locationInfo.places[0]['state abbreviation'];

                //mostra resposta no console
                console.log("Cidade:",cidade)
                console.log("Estado:",estado)
                console.log("Abreviação:",abreviacaoEstado)

                //Resposta em html
                const htmlResponse = `
                    <!DOCTYPE html>
                    <html lang="pt-BR">
                    <head>
                        <meta charset="utf-8">
                        <title>Informações de Localização</title>
                    </head>
                    <body>
                        <h1>Informações de Localização</h1>
                        <p>Cidade: ${cidade}</p>
                        <p>Estado: ${estado}</p>
                        <p>Abreviação do Estado: ${abreviacaoEstado}</p>
                    </body>
                    </html>
                `;

                
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(htmlResponse);
                res.end();
            } catch (error) {
                console.error('Erro ao analisar os dados da API:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Erro ao analisar os dados da API.');
            }
        });
    }).on('error', (err) => {
        console.error('Erro ao fazer solicitação para a API:', err.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro ao solicitar dados da API.');
    });
});

// Iniciando o servidor na porta 8080
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
