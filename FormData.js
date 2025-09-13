const mongoose= require('mongoose');
const FormDataSchema= new mongoose.Schema ({
    text: {
        type: String,
        required: true, // The task description is required.
      },
      completed: {
        type: Boolean,
        default: false, // By default, the task is not completed.
      },
      createdAt: {
        type: Date,
        default: Date.now, // Automatically store the creation date.
      },
});

const FormDataModel= mongoose.model('Todo_list', FormDataSchema);

module.exports= FormDataModel;