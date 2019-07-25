const mongoose = require('mongoose');
const DeviceModel = mongoose.model('Device');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.createDevice = function(req, res) {
	const name = req.body.name;
	const type = req.body.type;

	if (!name) {
		res.status(400).send('Missing name');
	}

	const newDevice = new DeviceModel({
		name: name,
		type: type
	});

	newDevice.save().then(function(device) {
		if (device) {
			res.status(200).send('Device Created');
		} else {
			res.status(400).send('Device creation failed');
		}
	});
};

module.exports.getDevices = function(req, res) {
	DeviceModel.find({}).then(function(devices) {
		res.json(devices);
	});
};

module.exports.getDeviceById = function(req, res) {
	const deviceId = req.query.id;
	DeviceModel.findById(deviceId)
		.then(function(device) {
			if (device) {
				res.json(device);
			} else {
				res.status(404).send('No device found with this id');
			}
		})
		.catch(function(error) {
			res.status(400).send(error);
		});
};

module.exports.updateDevice = function(req, res) {
	const deviceId = req.body.deviceId;
	const newStatus = req.body.status;

	DeviceModel.findByIdAndUpdate(deviceId, { status: newStatus }).then(function(device) {
		if (device) {
			res.status(200).send('Device Updated successfully');
		} else {
			res.status(400).send('Error while updating device');
		}
	});
};

module.exports.sendEmail = function(req, res) {
	const deviceId = req.body.deviceId;
	const date = new Date();
	const formattedDate = date.toISOString();
	const msg = {
		to: 'ionut.morariu@techtalents.es',
		from: 'test@example.com',
		subject: 'Sending with Twilio SendGrid is Fun',
		text: 'and easy to do anywhere, even with Node.js',
		html: '<strong>and easy to do anywhere, even with Node.js</strong>'
	};
	sgMail.send(msg).then(function(message) {
		console.log(message);
		if (message) {
			res.status(200).send('Email sent');
		}
	});
};
