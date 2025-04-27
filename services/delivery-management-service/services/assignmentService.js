const Driver = require('../models/driver'); // Ensure this path is valid

module.exports.assignDriver = async (location) => {
  try {
    // ✅ Find all drivers that are available
    const drivers = await Driver.find({ isAvailable: true });

    if (!drivers || drivers.length === 0) {
      throw new Error('No available drivers at the moment');
    }

    // ✅ Sort by fewest current orders (to balance load)
    const selectedDriver = drivers.sort((a, b) => (a.currentOrders || 0) - (b.currentOrders || 0))[0];

    // ✅ Update selected driver status
    selectedDriver.isAvailable = false;
    selectedDriver.currentOrders = (selectedDriver.currentOrders || 0) + 1;
    
    // ✅ Prevent accidental overwrite or save if schema is strict
    await Driver.findByIdAndUpdate(selectedDriver._id, {
      isAvailable: false,
      currentOrders: selectedDriver.currentOrders
    });
    
    return selectedDriver;
  } catch (err) {
    console.error('❌ assignDriver error:', err.message);
    throw new Error('Driver assignment failed: ' + err.message);
  }
};
