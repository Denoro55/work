const APITracks = [
	{
		id: 1,
		name: 'Faster'
	},
	{
		id: 2,
		name: 'Mother Earth'
	},
	{
		id: 3,
		name: 'Iron'
	}
]

export const getAsyncTracks = () => dispatch => {
    setTimeout(()=>{
		APITracks.map(function(item,i){
			dispatch({type: 'ADD_NAME', name: item })
		})
    },2000)
}