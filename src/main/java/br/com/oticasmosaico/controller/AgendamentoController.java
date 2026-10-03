package br.com.oticasmosaico.controller;

import br.com.oticasmosaico.model.Agendamento;
import br.com.oticasmosaico.model.AgendamentoRequest;
import br.com.oticasmosaico.model.AgendamentoResponse;
import br.com.oticasmosaico.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * API usada pelo formulário "Agendar" do site.
 *
 * POST /api/agendamentos
 */
@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AgendamentoResponse criar(@Valid @RequestBody AgendamentoRequest request) {
        Agendamento agendamento = service.registrar(request);
        return new AgendamentoResponse(
                agendamento.protocolo(),
                "Solicitação recebida. Nossa equipe entrará em contato para confirmar o horário."
        );
    }
}
