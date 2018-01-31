<template v-if="ready">
    <form class="form" @submit.prevent="buyCurrency">
        <div class="form-group">
            <label for="currency">Select Coin:</label>
            <select class="form-control" id="currency" v-model="selected" @change="setBuy">
                <option v-for="(value,index) in currency" v-bind:value="index">
                    {{ index.toUpperCase() }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label for="amount">Quantity Purchased:</label>
            <input class="form-control" id="amount" type="number" step="any" min="0" v-model="amount">
        </div>

        <div class="form-group">
            <label for="buyPrice">Buy Price:</label>
            <input class="form-control" id="buyPrice" type="number" step="any" min="0" v-model="buyPrice">
        </div>

        <button class="btn btn-block btn-success">Update Profile</button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                isReady: false,
                selected: 'bitcoin',
                amount: 0,
                buyPrice: 0,
                currency: [],
            }
        },
        computed: {
            ready() {
                return this.$store.state.ready
            }
        },
        methods: {
            setBuy() {
                if (!this.currency || this.currency === null) {
                    this.buyPrice = 0;
                    return;
                }

                this.buyPrice = this.currency[this.selected];
            },
            getCurrency() {
                this.currency = this.$store.getters.getCurrency;
            },

            buyCurrency() {
                //TODO Validation

                window.axios.post(`/profiles/${this.$store.getters.getUser.id}/investments`, {
                    currencyId: this.selected,
                    buyPrice: this.buyPrice,
                    quantity: this.amount,
                }).then((resp) => {
                    console.log(resp.data);
                    this.$store.commit('updateDashboard', resp.data.profile);
                });
            }
        },
        beforeMount() {
            this.getCurrency();
            this.setBuy(); //update default buyprice
        }
    }
</script>