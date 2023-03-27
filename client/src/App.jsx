import './App.css';

function App() {
  return (
    <main>
      <header>
        <a href="" className="logo">My Blog</a>
        <nav>
          <a href="">Login</a>
          <a href="">Register</a>
        </nav>
      </header>
      <div className="post">
        <img src="https://techcrunch.com/wp-content/uploads/2023/01/GettyImages-1227849474.jpg?w=430&h=230&crop=1" alt="Apple acquired a startup using AI to compress videos" />
        <div className="texts">
          <h2>Apple acquired a startup using AI to compress videos</h2>
          <p className="info">
            <a className="author">Jade Hendricks</a>
            <time>2023-03-27 15:58</time>
          </p>
          <p className="summary">
            Apple wouldn’t confirm the sale when asked for comment. 
            But WaveOne’s website was shut down around January, and several former employees, including one of WaveOne’s co-founders, now work within Apple’s various machine learning groups.
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;
