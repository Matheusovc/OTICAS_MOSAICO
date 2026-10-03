package br.com.oticasmosaico;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Ponto de entrada da aplicação.
 *
 * O Spring Boot serve automaticamente o site (index.html, css, js e imagens)
 * a partir de src/main/resources/static e expõe a API em /api/**.
 */
@SpringBootApplication
public class OticasMosaicoApplication {

    public static void main(String[] args) {
        SpringApplication.run(OticasMosaicoApplication.class, args);
    }
}
