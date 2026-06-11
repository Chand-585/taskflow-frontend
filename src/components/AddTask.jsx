import {useState} from 'react';

function addTask({onAdd}){
    const [title,setTitle] = useState('');
     function handleSubmit(e){
        e.preventDefault();
        if(!title.trim())
            return;
        onAdd(title);
        setTitle(' ')
     }
     return(
        <form onSubmit={handleSubmit}>
            <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add a new task..."
      />
        <button type="submit">Add Task</button>
        </form>
     );
}
export default addTask;