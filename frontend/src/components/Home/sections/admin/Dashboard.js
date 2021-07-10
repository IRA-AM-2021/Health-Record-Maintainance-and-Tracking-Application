import React, { useEffect,useState } from 'react'
import Chart from 'react-google-charts'

export default function Dashboard(props) {

    const [ totalDoctors, setTotalDoctors ]=useState(0)
    const [ verifiedDoctors,setVerifiedDoctors ]=useState(0)
    const [ notVerifiedDoctors,setNotVerifiedDoctors ]=useState(0)
    const [ totalIDCreated,setTotalIDCreated ]=useState(0)

    useEffect(()=>{
        (
            async()=>{
                let response=await fetch(`http://localhost:8000/api/doctor/hospital-total-view/?hospital_id=${props.hospitalid}`)
                let content=await response.json()
                console.log(content)
                setTotalDoctors(content.total_doctors)
                setVerifiedDoctors(content.verified_doctors)
                setNotVerifiedDoctors(content.not_verified_doctors)
                setTotalIDCreated(content.total_patient_id_creates)
            }
        )()
    })

    useEffect(()=>{
        var counters=document.querySelectorAll('.total-count');
        var speed=20000;
        counters.forEach(counter=>{
            var updateCount=()=>{
                var target=+counter.getAttribute('data-target');
                var count=+counter.innerText;
                var inc=target/speed;
                if(count<target){
                    counter.innerText=Math.ceil(count+inc);
                    setTimeout(updateCount,1);
                }
                else{
                    counter.innerText=target;
                }

            }
            updateCount();
        });
    },[])
   
    return (
        <div className="dashboard-content chart">
            <div class="grid-count">
                <div class="count-display book-count">
                    <h4>Total Doctors</h4>
                    <h2 class='total-count' data-target={totalDoctors}>{totalDoctors}</h2>
                </div>
                <div class="count-display member-count">
                    <h4>No.of Verified Doctors</h4>
                    <h2 class='total-count' data-target={verifiedDoctors}>{verifiedDoctors}</h2>
                </div>
                <div class="count-display book-count">
                    <h4>No.of Unverified Doctors</h4>
                    <h2 class='total-count' data-target={notVerifiedDoctors}>{notVerifiedDoctors}</h2>
                </div>
                <div class="count-display book-count">
                    <h4>Patients Registered</h4>
                    <h2 class='total-count' data-target={totalIDCreated}>{totalIDCreated}</h2>
                </div>
            </div>
            <div class="chart-display d-flex justify-content-around" style={{overflow:"hidden"}}>
                <Chart
                    width={'500px'}
                    height={'500px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Task', 'Hours per Day'],
                        ['Work', 11],
                        ['Eat', 2],
                        ['Commute', 2],
                        ['Watch TV', 2],
                        ['Sleep', 7],
                    ]}
                    options={{
                        title: 'My Daily Activities',
                        is3D: true,
                    }}
                    rootProps={{ 'data-testid': '2' }}
                />
                <Chart
                    width={'400px'}
                    height={'400px'}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Language', 'Speakers (in millions)'],
                        ['Assamese', 13],
                        ['Bengali', 83],
                        ['Bodo', 1.4],
                        ['Dogri', 2.3],
                        ['Gujarati', 46],
                        ['Hindi', 300],
                        ['Kannada', 38],
                        ['Kashmiri', 5.5],
                        ['Konkani', 5],
                        ['Maithili', 20],
                        ['Malayalam', 33],
                        ['Manipuri', 1.5],
                        ['Marathi', 72],
                        ['Nepali', 2.9],
                        ['Oriya', 33],
                        ['Punjabi', 29],
                        ['Sanskrit', 0.01],
                        ['Santhali', 6.5],
                        ['Sindhi', 2.5],
                        ['Tamil', 61],
                        ['Telugu', 74],
                        ['Urdu', 52],
                    ]}
                    options={{
                        title: 'Indian Language Use',
                        legend: 'none',
                        pieSliceText: 'label',
                        slices: {
                        4: { offset: 0.2 },
                        12: { offset: 0.3 },
                        14: { offset: 0.4 },
                        15: { offset: 0.5 },
                        },
                    }}
                    rootProps={{ 'data-testid': '5' }}
                />
            </div>            
        </div>
    )
}

