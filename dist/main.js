"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync(path.resolve(__dirname, '../ssl/server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, '../ssl/server.crt')),
    };
    const keyPath = path.resolve(__dirname, '../ssl/server.key');
    const certPath = path.resolve(__dirname, '../ssl/server.crt');
    const key = fs.readFileSync(keyPath);
    const cert = fs.readFileSync(certPath);
    console.log('SSL Key:', key.toString());
    console.log('SSL Certificate:', cert.toString());
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { httpsOptions });
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map