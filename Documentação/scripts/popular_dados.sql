-- Script de popular dados básicos para facilitar testes

-- Categorias
INSERT INTO categoria (nome_categoria) VALUES
('Alimentação'),
('Transporte'),
('Lazer'),
('Casa'),
('Saúde'),
('Despesas fixas');

-- Métodos
INSERT INTO metodo (nome_metodo)
SELECT novos.nome_metodo
FROM (VALUES
	('Pix'),
	('Dinheiro'),
	('Débito'),
	('Crédito'),
	('Transferência Bancária'),
	('Outro')
) AS novos(nome_metodo)
WHERE NOT EXISTS (
	SELECT 1
	FROM metodo existentes
	WHERE lower(btrim(existentes.nome_metodo)) = lower(btrim(novos.nome_metodo))
);

-- Moedas
INSERT INTO moeda (nome_moeda) VALUES
('Real Brasileiro');

-- Status de Usuário
INSERT INTO status_usuario (nome_status) VALUES
('Ativo'),
('Inativo'),
('Pendente'),
('Banido'),
('Suspenso'),
('Excluído');

-- Observação:
-- Não inserimos usuários com senha neste script porque a senha deve ser hasheada
-- Antes de inserir um usuário com senha diretamente no banco, gere o hash usando bcrypt e coloque aqui.
-- Alternativamente, crie o usuário via endpoint de cadastro do backend (POST /usuarios) que irá hashear a senha automaticamente.
