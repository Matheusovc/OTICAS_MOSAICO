package br.com.oticasmosaico.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Agendamento registrado pela loja.
 */
public record Agendamento(
        String protocolo,
        String nome,
        String telefone,
        String servico,
        String periodo,
        LocalDate dataPreferida,
        String mensagem,
        LocalDateTime criadoEm
) {
}
