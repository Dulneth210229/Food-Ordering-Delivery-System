const eventEmitter = require('./eventEmitter');

module.exports = function(io) {
  eventEmitter.on('deliveryAssigned', (data) => {
    console.log('Delivery assigned:', data);
    io.emit('deliveryAssigned', data); // emit to clients if needed
  });

  eventEmitter.on('statusUpdated', ({ delivery }) => {
    console.log('Delivery status updated:', delivery);
    io.emit('statusUpdated', delivery); // emit to clients if needed
  });
};
