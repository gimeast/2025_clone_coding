package gimeast.restfulapiex2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RestfulApiEx2Application {

    public static void main(String[] args) {
        SpringApplication.run(RestfulApiEx2Application.class, args);
    }

}
