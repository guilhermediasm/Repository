DROP TABLE `stirpe`.`produtos`;
DROP TABLE `stirpe`.`cors`;
DROP TABLE `stirpe`.`secaos`;

DELETE FROM `stirpe`.`produtos`;
DELETE FROM `stirpe`.`cors`;
DELETE FROM `stirpe`.`secaos`;

SELECT * FROM `stirpe`.`cors` LIMIT 50;
SELECT * FROM `stirpe`.`produtos` LIMIT 100;
SELECT * FROM `stirpe`.`secaos` LIMIT 5;

INSERT INTO `stirpe`.`produtos` (descricao, codigo_barra, codigo_barra_arezzo,referencia,cor_produto_codigo,valor)
VALUES ('verão', '123456789120', '321654987654', '2', '23', '50');
INSERT INTO `stirpe`.`produtos` (descricao, codigo_barra, codigo_barra_arezzo,referencia,cor_produto_codigo,valor)
VALUES ('Chinelo rsv bossa 43/44', '6882478104', '0', '6', '478', '499');

INSERT INTO `stirpe`.`cors` (descricao, codigo)
VALUES ('Branco', '14');
INSERT INTO `stirpe`.`cors` (descricao, codigo)
VALUES ('ceu azul estrelado', '23');
INSERT INTO `stirpe`.`cors` (descricao, codigo)
VALUES ('Caramelo', '478');

INSERT INTO `stirpe`.`secaos` (numero_secao, codigo_barra,quantidade)
VALUES ('1', '6882478104','7');
INSERT INTO `stirpe`.`secaos` (numero_secao, codigo_barra,quantidade)
VALUES ('1', '123456789120','4');

SELECT * FROM `stirpe`.`produtos` WHERE codigo_barra LIKE '%120%' OR codigo_barra_arezzo LIKE '%120%' LIMIT 5 OFFSET 0;