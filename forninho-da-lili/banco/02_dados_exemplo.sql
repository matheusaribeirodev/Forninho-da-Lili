-- 02_dados_exemplo.sql — rode DEPOIS do 01_criar_tabelas.sql

-- Senha de exemplo: forninho2026. Para gerar outra, rode no PHP:
--   echo password_hash('nova-senha', PASSWORD_DEFAULT);
-- e cole o resultado no lugar do hash abaixo.
INSERT INTO usuario (usuario, nome, senha_hash) VALUES
('lili', 'Lili', '$2y$10$TROQUE.ESTE.HASH.PELO.GERADO.COM.password_hash');

INSERT INTO categoria (id, nome, ordem) VALUES
('docinhos', 'Docinhos', 1), ('cookies', 'Cookies', 2), ('kits', 'Kits e presentes', 3);

INSERT INTO produto (nome, categoria, preco, descricao, alergia, imagem, imagem_alt, ativo) VALUES
('Coxinha de morango de chocolate tradicional','docinhos',9.00,'Morango envolvido em brigadeiro e coberto com granulado de chocolate.','Contém leite.','assets/img/produtos/coxinha-chocolate.jpg','Coxinha de morango coberta com granulado de chocolate, em forminha de papel branca',1),
('Coxinha de morango de amendoim e castanhas','docinhos',10.00,'Coberta com amendoim e castanhas, com chocolate por cima.','Contém leite, amendoim e castanhas.','assets/img/produtos/coxinha-amendoim.jpg','Coxinha coberta com amendoim e castanhas, com chocolate por cima, em forminha de papel branca',1),
('Coxinha de ninho com chocolate','docinhos',8.00,'Coxinha de ninho com chocolate aplicado à mão.','Contém glúten, leite e ovos.','assets/img/produtos/coxinha-ninho.jpg','Coxinha de ninho com chocolate aplicado por cima, em forminha de papel branca',1),
('Cookie com doce de leite','cookies',12.00,'Cookie com gotas de chocolate e doce de leite por cima.','Contém glúten, leite e ovos.','assets/img/produtos/cookie-doce-de-leite.jpg','Cookie com gotas de chocolate e doce de leite por cima, em embalagem transparente',1),
('Cookie com gotas de chocolate','cookies',10.00,'A versão clássica, com bastante gota de chocolate.','Contém glúten, leite e ovos.','','',1),
('Kit presente com 4 doces','kits',38.00,'Uma caixinha delicada para surpreender alguém especial.','Contém glúten, leite e ovos.','','',1),
('Kit colegas de trabalho com 12 doces','kits',98.00,'Doces sortidos para dividir com a equipe.','Contém glúten, leite e ovos.','','',1),
('Kit personalizado','kits',NULL,'Você conta a ocasião e a Lili monta o kit com os doces escolhidos.','Alérgicos variam conforme os doces escolhidos.','','',1);

INSERT INTO cliente (nome, telefone, email, cidade) VALUES
('Ana Souza','(11) 98765-4321','ana.souza@email.com','São Paulo'),
('Bruno Lima','(11) 97654-3210','bruno.lima@email.com','Osasco'),
('Carla Mendes','(11) 96543-2109','carla.mendes@email.com','Barueri'),
('Diego Santos','(11) 95432-1098','diego.santos@email.com','Carapicuíba'),
('Eduarda Rocha','(11) 94321-0987','eduarda.rocha@email.com','Santana de Parnaíba'),
('Fernanda Alves','(11) 93210-9876','fernanda.alves@email.com','Cotia');

INSERT INTO pedido (cliente_id, data_pedido, status, entrega, observacao) VALUES
(1, date('now','-12 days'), 'Entregue',   'Retirada', ''),
(2, date('now','-10 days'), 'Entregue',   'Entrega',  'Entregar na portaria.'),
(3, date('now','-7 days'),  'Entregue',   'Retirada', ''),
(4, date('now','-5 days'),  'Cancelado',  'Entrega',  'Cliente desistiu.'),
(5, date('now','-3 days'),  'Pronto',     'Retirada', 'Aniversário, caprichar no laço.'),
(1, date('now','-1 days'),  'Em preparo', 'Entrega',  ''),
(6, date('now'),            'Novo',       'Retirada', '');

INSERT INTO pedido_item (pedido_id, produto_id, quantidade, preco_unitario) VALUES
(1,1,10,9.00),(1,3,6,8.00),(2,7,1,98.00),(3,2,12,10.00),(3,4,4,12.00),
(4,6,2,38.00),(5,8,1,75.00),(5,1,8,9.00),(6,1,20,9.00),(6,5,6,10.00),(7,4,3,12.00);
