const emitter = require('./shared/events/eventEmitter');

emitter.emit('orderPlaced', {
  email: 'customer@example.com',
  phone: '+94771234567',
  orderId: 'ORDER123',
});
