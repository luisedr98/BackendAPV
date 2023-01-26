const generarID = () => Date.now().toString(32) + Math.random().toString(32).substr(2);

export default generarID;