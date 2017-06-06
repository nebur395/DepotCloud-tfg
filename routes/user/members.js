var express = require('express');

module.exports = function (app) {

    var router = express.Router();
    var User = app.models.User;

    /**
     * @swagger
     * /members/{email}/{name}:
     *   post:
     *     tags:
     *       - Members
     *     summary: Añadir un miembro a la unidad familiar.
     *     description: Añade un miembro a la unidad familiar.
     *     consumes:
     *       - application/json
     *       - charset=utf-8
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: Authorization
     *         description: |
     *           JWT estándar: `Authorization: Bearer + JWT`.
     *         in: header
     *         required: true
     *         type: string
     *         format: byte
     *       - name: email
     *         description: Email de la unidad familiar de la que se quiere añadir un miembro.
     *         in: path
     *         required: true
     *         type: string
     *       - name: name
     *         description: Nombre del miembro que se desea añadir a la unidad familiar.
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Mensaje de feedback para el usuario.
     *         schema:
     *           $ref: '#/definitions/FeedbackMessage'
     *       401:
     *         description: Mensaje de feedback para el usuario. Normalmente causado por no
     *           tener un token correcto o tenerlo caducado.
     *         schema:
     *           $ref: '#/definitions/FeedbackMessage'
     *       404:
     *         description: Mensaje de feedback para el usuario.
     *         schema:
     *           $ref: '#/definitions/FeedbackMessage'
     *       500:
     *         description: Mensaje de feedback para el usuario.
     *         schema:
     *           $ref: '#/definitions/FeedbackMessage'
     */
    router.post("/:email/:name", function (req, res) {

        User.findOne({email: req.params.email}, function (err, userResult) {

            if (err) {
                res.status(500).send({
                    "success": false,
                    "message": "Error interno del servidor."
                });
            }

            // Checks if a user already exist
            if (!userResult) {
                res.status(404).send({
                    "success": false,
                    "message": "La unidad familiar a la que se intenta acceder no existe."
                });
            } else {

                var members = userResult.members;
                members.push(req.params.name);
                members.sort();
                userResult.members = members;
                // Saves the user with the new member
                userResult.save(function (err) {
                    if (err) {
                        res.status(500).send({
                            "success": false,
                            "message": "Error interno del servidor."
                        });
                    } else {
                        res.status(200).send({
                            "success": true,
                            "message": "Miembro añadido correctamente a la unidad familiar."
                        });
                    }
                });
            }
        });
    });

    /**
     * @swagger
     * /members/{email}/{name}:
     *   put:
     *     tags:
     *       - Members
     *     summary: Modificar miembro de la unidad familiar.
     *     description: Modifica el nombre de un miembro de la unidad familiar.
     *     consumes:
     *       - application/json
     *       - charset=utf-8
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: Authorization
     *         description: |
     *           JWT estándar: `Authorization: Bearer + JWT`.
     *         in: header
     *         required: true
     *         type: string
     *         format: byte
     *       - name: email
     *         description: Email de la unidad familiar de la que se quiere modificar un miembro.
     *         in: path
     *         required: true
     *         type: string
     *       - name: name
     *         description: Nombre actual del miembro que se desea modificar en la unidad familiar.
     *         in: path
     *         required: true
     *         type: string
     *       - name: newName
     *         description: Nombre nuevo del miembro que se desea modificar en la unidad familiar.
     *         in: path
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Mensaje de feedback para el usuario.
     *         schema:
     *           $ref: '#/definitions/FeedbackMessage'
     *       401:
     *         description: Mensaje de feedback para el usuario. Normalmente causado por no
     *           tener un token correcto o tenerlo caducado.
     *         schema:
     *           $ref: '#/definitions/FeedbackMessage'
     *       404:
     *         description: Mensaje de feedback para el usuario.
     *         schema:
     *           $ref: '#/definitions/FeedbackMessage'
     *       500:
     *         description: Mensaje de feedback para el usuario.
     *         schema:
     *           $ref: '#/definitions/FeedbackMessage'
     */
    router.put("/:email/:name", function (req, res) {


    });

    return router;
};
