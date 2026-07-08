const usuarioModel = require('../models/usuarioModel')

exports.index = async (req, res) => {
  try {
    const results = await usuarioModel.all()
    res.json({ success: true, results })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar recuperar los usuarios' })
  }
}

exports.store = async (req, res) => {
  const { nombre, apellido, email, password, rol, telefono, dni, direccion, ciudad } = req.body
  try {
    const existente = await usuarioModel.findByEmail(email)
    if (existente) {
      return res.status(409).json({ success: false, message: 'Ya existe una cuenta con ese email' })
    }
    const usuario = await usuarioModel.create({ nombre, apellido, email, password, rol, telefono, dni, direccion, ciudad })
    res.status(201).json({ success: true, message: 'Usuario creado correctamente', usuario })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar crear el usuario' })
  }
}

exports.update = async (req, res) => {
  const { ID } = req.params
  const { nombre, apellido, email, password, rol, telefono, dni, direccion, ciudad } = req.body
  try {
    const actual = await usuarioModel.findById(ID)
    if (!actual) {
      return res.status(404).json({ success: false, message: 'El usuario no existe' })
    }
    const usuario = await usuarioModel.update({
      id: Number(ID),
      nombre: nombre ?? actual.nombre,
      apellido: apellido ?? actual.apellido,
      email: email ?? actual.email,
      password: password || undefined,
      rol: rol ?? actual.rol,
      telefono: telefono ?? actual.telefono,
      dni: dni ?? actual.dni,
      direccion: direccion ?? actual.direccion,
      ciudad: ciudad ?? actual.ciudad,
    })
    res.json({ success: true, message: 'Usuario actualizado correctamente', usuario })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar actualizar el usuario' })
  }
}

exports.destroy = async (req, res) => {
  const { ID } = req.params
  try {
    const actual = await usuarioModel.findById(ID)
    if (!actual) {
      return res.status(404).json({ success: false, message: 'El usuario no existe' })
    }
    await usuarioModel.remove(ID)
    res.json({ success: true, message: 'Usuario eliminado correctamente' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al intentar eliminar el usuario' })
  }
}

exports.updateProfile = async (req, res) => {
  const { nombre, apellido, telefono, dni, direccion, ciudad } = req.body
  try {
    const actual = await usuarioModel.findById(req.user.id)
    if (!actual) {
      return res.status(404).json({ success: false, message: 'El usuario no existe' })
    }
    const usuario = await usuarioModel.update({
      id: req.user.id,
      nombre: nombre ?? actual.nombre,
      apellido: apellido ?? actual.apellido,
      email: actual.email,
      rol: actual.rol,
      telefono: telefono ?? actual.telefono,
      dni: dni ?? actual.dni,
      direccion: direccion ?? actual.direccion,
      ciudad: ciudad ?? actual.ciudad,
    })
    res.json({ success: true, message: 'Perfil actualizado', usuario })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Error al actualizar el perfil' })
  }
}
