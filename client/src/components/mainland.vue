<template>
  <div class="app">
    <navbar />
    <animation />
    <div class="columns is-mobile">
      <div class="column is-half is-offset-one-quarter  m-lg">
        <div class="block">
          <b-field>
            <b-input
              v-model="entry"
              placeholder="Ambulance"
            />
          </b-field>
        </div>
        <div class="block is-pulled-right">
          <h2>Diye yazılır,</h2>
        </div>
        <div class="block">
          <b-field>
            <b-input
              v-model="read"
              placeholder="Embulıns"
            />
          </b-field>
        </div>
        <div class="block  is-pulled-right">
          <h2>Diye okunur.</h2>
        </div>
      </div>
    </div>
    <!-- Send button & Feedback -->
    <div class="columns is-mobile">
      <div class="column is-half is-offset-one-quarter ">
        <div class="block ">
          <a
            class="button is-medium is-danger is-pulled-right"
            @click="postSend"
          >
            Gönder
          </a>
        </div>
        <div class="block">
          {{ feedback }}
        </div>
      </div>
    </div>

    <div id="contain-loop">
       <div v-if="loopEntries" class="column is-full is-centered"> 
          <div v-for="(entry,index) in loopEntries" :key="index"  class="box">
            <article class="media">
              <div class="media-left">
              <figure class="image is-64x64"><img src="https://img.icons8.com/doodle/1600/user-female-red-hair.png" alt="Image">
          </figure>
          </div>
          <div class="media-content"> 
            <div class="content">
            <div class="subtitle is-4 s-lft metincont">
              <a class="read">{{ entry.title }} </a><span> diye yazılır,</span><span class="write"> {{ entry.text }} diye okunur.</span>
              </div></div>
                <nav class="level is-mobile">
                  <div class="level-left s-lft">
                  <a class="level-item" aria-label="reply">
                    <span class="icon is-small"><i class="fas fa-arrow-alt-circle-up" aria-hidden="true"></i></span>
                  </a>
                  <a class="level-item " aria-label="retweet">
                    <span class="icon is-small"><i class="fas fa-arrow-alt-circle-down" aria-hidden="true"></i></span>
                  </a>
                  <a class="level-item" aria-label="like">
                  <span class="icon is-small"> <i class="fas fa-heart" aria-hidden="true"></i></span>
                  </a>
                  </div>
              <span class="is-pulled-right s-top has-text-weight-bold cap"> {{ entry.user }} </span>
             </nav></div>
          </article>
          </div>
          <footerComponent />
      </div>
    </div>
    <!-- Footer Banner -->
    
  </div>
</template>
<script>
import axios from 'axios';
import slugify from 'slugify';
import navbar from './navbar.vue';
import animation from './animation.vue';
import footerComponent from '@/components/footerComponent.vue';

export default {
	name: 'Mainland',
	data() {
		return {
			mains: [],
			titles: [],
			comments: [],
			commentsmain: [],
			author: [],
			list: [],
			loopEntries: [],
			listcom: [],
			entry: null,
			read: null,
			slug: null,
			feedback: null,
			user: null
		};
	},
	components: {
		navbar,
		animation,
		footerComponent
	},
	methods: {
		async postSend(event) {
			event.preventDefault();
			try {
				if (this.entry && this.read) {
					this.slug = slugify(this.entry, {
						replacement: '-',
						remove: /[$*_+~.()'"!\-:@]/g,
						lower: true
					}).toString(); // Create a slug
				}
				// Check this slug, if it is already in database, add the read to its directory
				const slugRes = await axios.get(
					`slugs/${this.slug}`
				);
				const slugId = slugRes.data && slugRes.data[0] && slugRes.data[0]._id;

				// If Slug is true, save the comment to it's ID
				if (slugId) {
					const postToSlug = await axios.post(
						`posts/${slugId}/add`,
						{
							text: this.read,
							author: { username: this.user }
						}
					);
					console.log('Added to existing post');
					return postToSlug;
					// If Slug is false, create a new comment with new post ID
				}
				axios
					.post('addpost', {
						title: this.entry,
						slug: this.slug
					})
					.then(response => {
						console.log(response.data._id);
						axios
							.post(`posts/${response.data._id}/add`, {
								text: this.read,
								title: this.entry,
								author: { username: this.user }
							})
							.then(final => {
								console.log('created', final);
								this.entry = null;
								this.read = null;
							});
					});
			} catch (error) {
				console.log('error in postSend() =', error);
			}
		}
	},
	props: {
		msg: String
	},
	created() {
		// Get User Info
		if (localStorage.getItem('user') != null) {
			this.user = localStorage.getItem('user');
		}

		// Get Post Details
    
		axios
			.get('http://localhost:3030/posts')
			.then(response => {
				this.mains = JSON.stringify(response.data);
				this.mains = JSON.parse(this.mains);
				console.log(this.mains);
				//   An extra rule will come here for profile pictures.
				
				for (let i = 0; i < this.mains.length; i++) {
					const currentData = this.mains[i];
					const currentComment = currentData.comments[currentData.comments.length - 1];
					this.loopEntries.push({
						title: currentData.title,
						text: currentComment.text,
						user: currentComment.author.username});
				}
				console.log(this.loopEntries);
				console.log(this.loopEntries[0]);
			})
			.catch(error => {
				console.log(error);
			});
	},
	mounted() {}
};
</script>

<style>
input[type="text"] {
  height: 4em !important;
}
.stable-text {
  display: inline-block;
  font-size: 18px;
}
.cap:first-letter {
  text-transform: capitalize;
}
.m-lg {
  margin: 1em;
}
.s-lg {
  margin: 0.2em;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#main-form {
  background: #42b983;
}
</style>
