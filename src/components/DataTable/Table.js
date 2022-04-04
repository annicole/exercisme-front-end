import React, { useEffect, useState } from "react";
import { getTestimonials } from "../../api/api";
import DropDownLanguage  from "../HeaderTable/DropDownLanguage";
import DropDownSort from "../HeaderTable/DropDownSort";
import Footer from "../FooterTable/Footer";
import SearchInput from "../HeaderTable/SearchInput";
import TableLoading from "./TableLoading";
import TestimonialsTable from "./TestimonialsTable";

export default function Table() {
  const [errorState, setErrorState] = useState({ hasError: false });
  const [testimonials,setTestimonials] = useState([])
  const [loading,setLoading] = useState(true)
  const [valueSort,setValueSort] = useState("oldest_first")
  const [textSearch,setTextSearch] = useState("")
  const [page,setPage] = useState(1)
  const [pagination,setPagination] = useState({})
  const [tracks,setTracks] = useState([])
  const [selectedTrack,setSelectedTrack] = useState("All")
 
  useEffect(()=>{
    getTestimonials(page,valueSort,textSearch,selectedTrack).then(data=>{
      setTestimonials(data.results)
      setPagination(data.pagination)
      const tracksObj={...data.track_counts,All:data.pagination.total_pages};
      setTracks(Object.entries(tracksObj).sort())
      setLoading(false)
    } )
    .catch(handleError);
  },[page,textSearch,valueSort,selectedTrack]);

  const onHadleSortChange = (e) => {
    setLoading(true)
    setValueSort(e.target.value)
  };

  const onHandleInputChange = (event) =>{
    event.preventDefault();
    const text = event.target.value;
    setTextSearch(text);
  }

  const handleError = (err) => {
    setErrorState({ hasError: true, message: err.message });
  };

  const onChangePage = (next) =>{
    if(!pagination.current_page && page + next <= 0 ) return;
    if(!pagination.current_page && page + next >= pagination.total_pages) return;
    setPage(page +next)
  }

  const onTrackChange = (track) =>{
    setSelectedTrack(track)
  }

  return (
    <div className="relative overflow-x-auto rounded-lg shadow-[0_4px_42px_0px_rgba(79,114,205,0.15)] mx-6 mt-3 mb-6">
      <div className="p-4 border-b">
        <div className="flex flex-row justify-between flex-nowrap">
          <div className="flex flex-row flex-1">
            <DropDownLanguage tracks={tracks} selectedTrack={selectedTrack}  onTrackChange ={onTrackChange}/>
            <SearchInput handleChange={onHandleInputChange} />
          </div>
          <div className="flex mr-3">
            <DropDownSort
              name="sortDropDown"
              value={valueSort}
              handleChange={onHadleSortChange}
            />
          </div>
        </div>
      </div>
      {loading ? <TableLoading /> : <TestimonialsTable testimonials={testimonials}/> }
      <Footer onChangePage={onChangePage} page={page}  total={pagination.total_pages} />
    </div>
  );
}
