package br.com.oticasmosaico.service;

import br.com.oticasmosaico.model.Agendamento;
import br.com.oticasmosaico.model.AgendamentoRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Regras de negócio do agendamento.
 *
 * Nesta primeira versão os agendamentos ficam em memória e são registrados no log.
 * Próximos passos naturais: persistir com Spring Data JPA (PostgreSQL/MySQL)
 * e notificar a equipe por e-mail (spring-boot-starter-mail).
 */
@Service
public class AgendamentoService {

    private static final Logger log = LoggerFactory.getLogger(AgendamentoService.class);
    private static final DateTimeFormatter PROTOCOLO_DATA = DateTimeFormatter.ofPattern("yyMMdd");

    private final List<Agendamento> agendamentos = new CopyOnWriteArrayList<>();
    private final AtomicInteger sequencia = new AtomicInteger();

    public Agendamento registrar(AgendamentoRequest request) {
        Agendamento agendamento = new Agendamento(
                gerarProtocolo(),
                request.nome().trim(),
                request.telefone(),
                request.servico(),
                valorOuPadrao(request.periodo(), "Sem preferência"),
                request.dataPreferida(),
                request.mensagem(),
                LocalDateTime.now()
        );

        agendamentos.add(agendamento);
        // Não registra telefone nem observações no log (dados pessoais).
        log.info("Novo agendamento {} — {} ({})", agendamento.protocolo(), agendamento.servico(), agendamento.periodo());

        return agendamento;
    }

    private String gerarProtocolo() {
        return "MOS-%s-%04d".formatted(LocalDate.now().format(PROTOCOLO_DATA), sequencia.incrementAndGet());
    }

    private static String valorOuPadrao(String valor, String padrao) {
        return (valor == null || valor.isBlank()) ? padrao : valor;
    }
}
