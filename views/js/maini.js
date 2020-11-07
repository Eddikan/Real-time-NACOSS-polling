const form = document.getElementById('vote-form');
var event;

//bring in candidate model
// let Candidate = require('../models/candidate');

form.addEventListener('submit', e=>{
    
    const choice = document.querySelector('input[name=os]:checked').value;
    const data = {os: choice};

    fetch('http://localhost:4040/poll/work',{
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }).then(res => res.json())
    .catch(err => console.log(err));

    e.preventDefault();
});

fetch("http://localhost:4040/poll/work")
    .then(res => res.json())
    .then(data => {
        var votes = data.votes;
        var totalVotes = votes.length;
        document.querySelector('#chartTitle').textContent = `Total Votes: ${totalVotes}`;

        var voteCounts = {
            a: 0,
            MacOS: 0,
            Linux: 0,
            Other: 0
        };

        voteCounts = votes.reduce((acc, vote) => (
            (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc),
            {}
        );
            var yop = 'a';
            var yob = 'b';
            var yoc = 'c';
            var yod = 'd';
        var dataPoints = [
            { label: yop, y: voteCounts.a },
            { label: yob, y: voteCounts.MacOS },
            { label: yoc, y: voteCounts.Linux },
            { label: yod, y: voteCounts.Other }
        ];
            
        const chartContainer = document.querySelector('#chartContainer');
        
        if(chartContainer){

            // Listen for the event.
            document.addEventListener('votesAdded', function (e) { 
                document.querySelector('#chartTitle').textContent = `Total Votes: ${e.detail.totalVotes}`;
            });
            
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                data:[
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.render();
        
             // Enable pusher logging - don't include this in production
             Pusher.logToConsole = true;
        
             var pusher = new Pusher('15162154cd5c887fb90a', {
                cluster: 'eu',
                encrypted: true
              });
         
             var channel = pusher.subscribe('os-poll');

             channel.bind('os-vote', function(data) {
               dataPoints.forEach((point)=>{
                   if(point.label==data.os)
                   {
                        point.y+=data.points;
                        totalVotes+=data.points;
                        event = new CustomEvent('votesAdded',{detail:{totalVotes:totalVotes}});
                        // Dispatch the event.
                        document.dispatchEvent(event);
                   }
               });
               chart.render();
             });
        }

});
