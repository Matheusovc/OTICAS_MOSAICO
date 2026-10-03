package br.com.oticasmosaico.model;

/**
 * Resposta devolvida ao site após registrar o agendamento.
 */
public record AgendamentoResponse(String protocolo, String mensagem) {
}
