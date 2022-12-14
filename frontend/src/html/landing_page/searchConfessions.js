import React, {useEffect, useState} from 'react';

export default function SearchConfessions(searchVal, oid){
  const [post, setPosts] = useState([]);
  const[wasLastList, setWasLastList] = useState(false);
  useEffect(() => {
    setPosts([]);
    oid = '';
    setWasLastList(false)
  }, [searchVal]);
  if(post.length == 0 && wasLastList){
    
    setWasLastList(false)
  }
    useEffect(() => {
     
        //console.log('oid: ' + oid)
        //console.log('searchVal: ' + searchVal)
        const displayPosts = async event =>
        {
          const data = await fetch("/api/v1/confessions/searchConfession", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              searchVal,
              oid,
            }),
          })
          .then(res => {
            res.json().then((data) => {
                
              
              if(data.length < 15){
                setWasLastList(true);
                setPosts([...post, ...data]);
                
                return;
              }
              setPosts([...post, ...data]);

              //console.log(length);
            }) 
          })
          .catch(err => {
            console.log(err);
          });
        }
        if(!wasLastList){
          displayPosts();
        }
          
        
    }, [searchVal, oid])
    return {post, wasLastList};
}