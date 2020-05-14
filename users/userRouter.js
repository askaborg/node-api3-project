const express = require("express")
const Users = require("./userDb.js")

const router = express.Router()

router.post("/", validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
  .then( resp => {
    res.status(201).json(resp)
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error creating the user."})
  })
})

router.post(
  "/:id/posts", validateUserId, validatePost, (req, res, next) => {
  // do your magic!
  req.body.user_id = req.params.id
  next()
})

router.get("/", (req, res) => {
  // do your magic!
  Users.get()
  .then( resp => {
    res.status(200).json(resp)
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error fetching users."})
  })
})

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params

  Users.getById(id).then( resp => {
    res.status(200).json(resp)
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error fetching user information."})
  })
})

router.get("/:id/posts", validateUserId, (req, res, next) => {
  // do your magic!
  next()
})

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params

  Users.remove(id)
  .then( resp => {
    res.status(200).json({message: "user deleted"})
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error deleting the user."})
  })
})

router.put("/:id", validateUserId, validateUser, (req, res) => {
  // do your magic!
  const { id } = req.params

  Users.update(id, req.body)
  .then( resp => {
    res.status(200).json({id, name: req.body.name})
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error updating the user."})
  })
})

router.put("/:id/posts/:postId", validateUserId, validatePost, (req, res, next) => {
  req.body.user_id = req.params.id
  next()
})

//custom middleware
function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params

  Users.getById(id)
  .then( resp => {
    if(resp !== undefined) {
      next()
    } else {
      res.status(404).json({errorMessage: "User could not be found"})
    }
    
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error fetching the user."})
  })
}

function validateUser(req, res, next) {
  // do your magic!
  if(!req.body.name) {
    res.status(400).json({errorMessage: "Please send a name."})
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if(!req.body.id || !req.body.text) {
    res.status(400).json({
      errorMessage: "Please send both text and user_id."})
  } else {
    next()
  }
}

module.exports = router
