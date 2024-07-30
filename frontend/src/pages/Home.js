// src/pages/Home.js
import React from 'react';
import FlightList from '../components/Dashboard/FlightList';

const Home = () => {
    return (
        <div className='w-screen flex flex-col justify-center items-center'>
            <section className='w-4/5 bg-slate-200 '>
                <h1 className='text-4xl px-2 py-10'>Welcome to the Flight Dashboard</h1>
            </section>
            <section className='w-4/5'>
                <FlightList />
            </section>
        </div>
    );
};

export default Home;





