import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import React, { Fragment, useEffect, useState } from 'react';
import './App.css';

function App() {
  //Setting all state hooks
  const [ideas, setIdeas] = useState([]);
  const [select, setSelect] = useState("filter-id");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [pages, setPages] = useState();
  const [page, setPage] = useState(0);
  const ideasPerPage = 6;

  const voteOnIdea = (idea, vote) => {
    axios.post(`http://localhost:8000/api/ideas/${idea.id}/vote?vote=${vote}`)
      .then(response => {
        if (response.status === 200) {
          getIdeas();
        } else {
          alert('An error occurred !');
        }
      })
      .catch(error => {
        console.error(error);
        alert('An error occurred !');
      })
  }

  const getIdeas = () => axios.get('http://localhost:8000/api/ideas').then(res => setIdeas(res.data) + setPages(Math.ceil(res.data.length / ideasPerPage)));

  // Request to API
  useEffect(() => {
    getIdeas();
  }, [])

  // Pagination
  const changePage = (param) => {
    if (param === 'next') {
      console.log(page + 1)
      setPage(page + 1)
    } else if (param === 'prev') {
      console.log(page - 1)
      setPage(page - 1)
    }
  }

  return (
    <div className="App">

      <div className="container mt-4">
        <div className="row justify-content-md-center">
          <div className="col-lg-12">
            <h1>Ideas List</h1>
          </div>
          <div className="col-lg-12 mb-4">
            <h4>Test Windoo by <a target="_blank" rel="noopener noreferrer" href="http://reyesvictor.github.io/">Victor Reyes</a></h4>
            <div className="d-flex mt-4">
              <input aria-label="Search" className="form-control mr-sm-2" type="search" placeholder={
                ideas && ideas && ideas.length > 0 ? "Search a specific title in the " + ideas.length + " results" : "No results to search in"
              } onChange={e => setSearch(e.target.value)} />
              <select id="filter" className="form-control" value={select} onChange={e => setSelect(e.target.value)}>
                <option value="filter-id" disabled={select === 'filter-id' ? true : false}>Filter by Id</option>
                <option value="filter-date" disabled={select === 'filter-date' ? true : false}>Filter by Date</option>
                <option value="filter-score" disabled={select === 'filter-score' ? true : false}>Filter by Score</option>
              </select>
              <button className="btn btn-light m-1" onClick={(e) => e.preventDefault() + setOrder('asc')} disabled={order === 'asc' ? true : false}>ASC</button>
              <button className="btn btn-light m-1" onClick={(e) => e.preventDefault() + setOrder('desc')} disabled={order === 'desc' ? true : false}>DESC</button>
              <br />
            </div>
            <p></p>
          </div>

          {ideas && ideas.length > 0 ?
            ideas
              // Filter results depending on search words
              .filter(idea => idea.title.toLowerCase().includes(search.toLowerCase()))
              // Sort by date/score/id and in asc/desc
              .sort((a, b) => {
                switch (select) {
                  case 'filter-date':
                    return order === 'asc' ? a.date_number - b.date_number : b.date_number - a.date_number;
                  case 'filter-score':
                    return order === 'asc' ? a.score - b.score : b.score - a.score;
                  default:
                    return order === 'asc' ? a.id - b.id : b.id - a.id;
                }
              })
              .slice(page === 0 ? page : ideasPerPage * page, page === 0 ? ideasPerPage : ideasPerPage * (page + 1))
              // Display the results
              .map(idea => {
                return <Fragment key={idea.id}>
                  <div className="col-lg-4 mb-4">
                    {console.log('Render')}
                    <div className="card">
                      <div className="card-header">Idea n° <span style={select === "filter-id" ? { fontWeight: 'bold' } : null}>{idea.id}</span></div>
                      <div className="card-body">
                        {/* Display the matching title characters with the search in bold */}
                        <div>
                          {!search || search === "" ? idea.title : <div dangerouslySetInnerHTML={{ __html: idea.title.replace(new RegExp(search, "ig"), "<b>" + search.toLowerCase() + "</b>") }} />}
                        </div>
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">Score of <span style={select === "filter-score" ? { fontWeight: 'bold' } : null}>{idea.score}</span>/50</li>
                      </ul>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">  <button className="btn btn-success" onClick={(e) => voteOnIdea(idea, 1)} >Upvote</button></li>
                        <li className="list-group-item">  <button className="btn btn-warning" onClick={(e) => voteOnIdea(idea, -1)} >Downvote</button></li>
                      </ul>
                      <div className="card-footer"><small className="text-muted">
                        Posted the <span style={select === "filter-date" ? { fontWeight: 'bold' } : null} >
                          {
                            idea.createdAt.date.substr(8, 2) + "/" +
                            idea.createdAt.date.substr(5, 2) + "/" +
                            idea.createdAt.date.substr(0, 2) + " at " +
                            idea.createdAt.date.substr(11, 2) + "h" +
                            idea.createdAt.date.substr(14, 2)
                          }
                        </span>
                        <br /> by {idea.author}
                      </small></div>
                    </div>
                  </div>
                </Fragment>
              })
            : null
          }

        </div>
      </div>

      <div className="col-12" style={{ position: 'fixed', bottom: '10vh' }}>
        <button className="btn btn-light" onClick={e => e.preventDefault() + changePage('prev')} disabled={page === 0 ? true : false}>Prev</button>
        <button className="btn btn-light" onClick={e => e.preventDefault() + changePage('next')} disabled={ideas && ideasPerPage * (page + 1) > ideas.length ? true : false}>Next</button>
      </div>
    </div >
  );
}

export default App;
