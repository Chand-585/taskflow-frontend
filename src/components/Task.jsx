function Task({title,status,priority}){
    return (
        <div style={{border: '1px solid #ccc',
            padding:'12px',
            marginBottom:'8px',
            borderRadius:'8px'
        }}>
            <h3>{title}</h3>
            <p>Status:{status}</p>
            <p>Priority:{priority}</p>
        </div>
    );
}
export default Task;