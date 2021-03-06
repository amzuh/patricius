"use strict"
// Dependências
let mongoose = require("mongoose")
let mongotypes = mongoose.Types	
let db = require("../../db")
let moment = require("moment")
let multer = require("multer")
// Model
let Model = require("../model/tournament")

// Date configs
moment.locale('pt-PT');

// Factory Function
const Tournament = () => {

	/********************************
	*    	 PRIVATE METHODS         *
	********************************/

	/********************************
	*    GET JSON DE TOURNAMENTS        *
	********************************/
	let getAll = (req, res, next) => {
		// Find all
		Model.find({}, (err, docs) => {
			// handle err
			if (err) throw err

			// build with names, tipo, date, imgs
			let output = docs.map(
				(t) =>  { // t = tournamnet

					// output obj
					let newt = {
						id: t._id.toString(),
						name: t.name,
						date: moment(t.date, "DD/MM/YYYY"),
						type: t.type,
						imgs: t.imgs
					}

					return newt
				} 
			)
			console.log(output)


			// resposta
			res.json(output)
			res.end()
		})
	}

	let getOne = (req, res, next) => {
		let oneId = req.params.id
		// find one
		Model.findOne({_id: mongotypes.ObjectId(oneId)}, (err, doc) => {
			// handle err
			if (err) throw err

			res.json(doc)
			res.end()
		})
	}

	/********************************
	*      INSERIR NOVO TOURNAMENT      *
	********************************/
	let post = (req, res, next) => {

		// constroi novo modelo para inserir
		let mountTournament = (t) => { // t = tournament
			console.log(t)
			return new Model({
				status: t.status || null,
				name: t.name || null,
				type: t.type || null,
				date: moment(t.date) || new Date(), // poe data em iso
				teams: t.teams || [],
				games: t.games || [],
				created_at: new Date(),
			})	
		}
		// Campos a inserir
		let tournament = mountTournament(req.body.tournament)

		// Data validations
		//if (!tournament.name || !tournament.status || !tournament.type) res.status(401).send("Não tem nome, status ou tipo")



		tournament.save(tournament, (err, docs) => {

			if (err) res.status(500).send({error: err }).end()

			res.status(200).send(true)
		})
	}
	let postManyImgs = (req, res, next) => {

	}
	/********************************
	*    	  UPDATE TOURNAMENT         *
	********************************/

	let put = (req, res, next) => {
		// get id
		let updateId = mongotypes.ObjectId(req.params.id)
		// Campos a inserir
		// n posso passar _id pq é imutável, portanto nao dá pra fazer new Model()
		let t = Object.assign(req.body.tournament, {}) 

		Model.findOneAndUpdate(
			{ _id: updateId }, // query
			t, // new doc
			{upsert: false},// options
			(err, doc) => { // callback
				if (err) throw err
				res.end("TOURNAMENT atualizado")
			}
		)
	}

	let putImg = (req, res, next) => {
		console.log(req.file.filename)
		let tournamentId = re.params.id
		Model.findOneAndUpdate({_id: tournamentID}, (err, doc) => {
			// push img filename to db imgs[]
		})

		res.status(200)
		res.send("http://192.168.1.66:3000/imgs/tournaments/" + req.file.filename)
		res.end()
	}
	/********************************
	*    	  DELETE TOURNAMENT         *
	********************************/
	let del = (req, res, next) => {
		let delId = mongotypes.ObjectId(req.params.id)
		Model.remove({ _id: delId }, (err) => {
			if (err) throw err
			res.status(200).send(true)
		})
	}

	/********************************
	*    	  PUBLIC METHODS         *
	********************************/
	return {
		getAll: getAll,
		getOne: getOne,
		post: post,
		putImg: putImg,
		put: put,
		delete: del
	}

}

module.exports = Tournament()