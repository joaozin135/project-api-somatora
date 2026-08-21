import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupDocumentationConfig(app: INestApplication){
    const config = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('Documentation for the API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger/reference', app, document, {
        customSiteTitle: 'API / SOMATORA'
    });
}